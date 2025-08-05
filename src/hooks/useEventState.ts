"use client";

import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { updateParticipant } from "@/app/actions";
import type { Event } from "@/app/model/Event";

export function useEventState(event: Event) {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [participantName, setParticipantName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 自動的にユーザーIDを生成・取得
  useEffect(() => {
    try {
      let id = localStorage.getItem("userId");
      if (!id) {
        id = uuidv4();
        try {
          localStorage.setItem("userId", id);
        } catch (error) {
          console.error("localStorage保存エラー:", error);
          // localStorageが使えない場合でもアプリケーションは動作継続
        }
      }
      setUserId(id);

      // LocalStorageから名前を取得
      try {
        const savedName = localStorage.getItem(`userName:${event.id}`);
        if (savedName) {
          setParticipantName(savedName);
        }
      } catch (error) {
        console.error("名前の取得エラー:", error);
      }

      // 既存の参加者なら選択済み日付と名前を復元
      if (event.participants[id]) {
        setSelectedDates(new Set(event.participants[id].ng_dates));
        if (event.participants[id].name) {
          setParticipantName(event.participants[id].name);
        }
      }
    } catch (error) {
      console.error("ユーザーID初期化エラー:", error);
      // エラーが発生してもランダムIDを生成して継続
      setUserId(uuidv4());
    }
  }, [event.participants, event.id]);

  const handleDateClick = (date: string) => {
    if (!userId) return;

    const newSelectedDates = new Set(selectedDates);
    if (newSelectedDates.has(date)) {
      newSelectedDates.delete(date);
    } else {
      newSelectedDates.add(date);
    }
    setSelectedDates(newSelectedDates);

    // 自動保存 - Promiseを適切にハンドリング
    saveData(Array.from(newSelectedDates), participantName).catch((error) => {
      console.error("自動保存エラー:", error);
    });
  };

  const handleNameChange = (name: string) => {
    setParticipantName(name);

    // LocalStorageに保存
    try {
      if (name) {
        localStorage.setItem(`userName:${event.id}`, name);
      } else {
        localStorage.removeItem(`userName:${event.id}`);
      }
    } catch (error) {
      console.error("名前の保存エラー:", error);
    }

    // 選択済み日付がある場合のみサーバーに保存
    if (selectedDates.size > 0) {
      saveData(Array.from(selectedDates), name).catch((error) => {
        console.error("名前保存エラー:", error);
      });
    }
  };

  const saveData = async (dates: string[], name?: string) => {
    if (!userId) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      await updateParticipant(event.id, userId, dates, name === "" ? undefined : name);

      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    } catch (error) {
      console.error("保存に失敗しました:", error);
      setSaveError("保存に失敗しました。もう一度お試しください。");
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // NG日カウントをメモ化して最適化 - 他の人のNG日 + 自分のリアルタイム選択
  const ngCountsByDate = useMemo(() => {
    const counts: Record<string, number> = {};

    // 他の人のNG日をカウント
    Object.entries(event.participants).forEach(([participantId, participant]) => {
      if (participantId !== userId) {
        participant.ng_dates.forEach((date) => {
          counts[date] = (counts[date] || 0) + 1;
        });
      }
    });

    // 自分の現在の選択をカウントに追加
    if (userId) {
      selectedDates.forEach((date) => {
        counts[date] = (counts[date] || 0) + 1;
      });
    }

    return counts;
  }, [event.participants, selectedDates, userId]);

  const getNGCountForDate = (dateStr: string) => {
    return ngCountsByDate[dateStr] || 0;
  };

  return {
    userId,
    selectedDates,
    participantName,
    isSaving,
    showSaveSuccess,
    saveError,
    handleDateClick,
    handleNameChange,
    getNGCountForDate,
  };
}
