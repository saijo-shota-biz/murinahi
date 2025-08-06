/**
 * サーバーアクションのバリデーション関数
 */

// UUID v4の正規表現パターン
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// 日付形式の正規表現パターン (YYYY-MM-DD)
const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// 最大値の定義
const MAX_TITLE_LENGTH = 50;
const MAX_NG_DATES = 365; // 1年分
const MAX_EVENT_ID_LENGTH = 20;
const MAX_PARTICIPANT_NAME_LENGTH = 20;

/**
 * UUID v4形式の検証
 */
export function isValidUUID(uuid: string): boolean {
  if (typeof uuid !== "string") return false;
  return UUID_V4_REGEX.test(uuid);
}

/**
 * 日付形式の検証 (YYYY-MM-DD)
 */
export function isValidDateFormat(date: string): boolean {
  if (typeof date !== "string") return false;
  if (!DATE_FORMAT_REGEX.test(date)) return false;

  // 有効な日付かチェック
  const [year, month, day] = date.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);

  return dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day;
}

/**
 * イベントタイトルの検証
 */
export function validateEventTitle(title: string | undefined): string | undefined {
  // undefined または空文字列は許可
  if (title === undefined || title === "") return undefined;

  if (typeof title !== "string") {
    throw new Error("タイトルは文字列である必要があります");
  }

  const trimmed = title.trim();

  // 空白のみの場合はundefinedを返す
  if (trimmed === "") return undefined;

  if (trimmed.length > MAX_TITLE_LENGTH) {
    throw new Error(`タイトルは${MAX_TITLE_LENGTH}文字以内で入力してください`);
  }

  return trimmed;
}

/**
 * イベントIDの検証
 */
export function validateEventId(eventId: string): void {
  if (typeof eventId !== "string") {
    throw new Error("イベントIDが無効です");
  }

  if (eventId.length === 0 || eventId.length > MAX_EVENT_ID_LENGTH) {
    throw new Error("イベントIDが無効です");
  }

  // 英数字のみを許可
  if (!/^[a-zA-Z0-9]+$/.test(eventId)) {
    throw new Error("イベントIDが無効です");
  }
}

/**
 * ユーザーIDの検証
 */
export function validateUserId(userId: string): void {
  if (!isValidUUID(userId)) {
    throw new Error("ユーザーIDが無効です");
  }
}

/**
 * NG日付リストの検証
 */
export function validateNgDates(ngDates: string[]): void {
  if (!Array.isArray(ngDates)) {
    throw new Error("日付リストが無効です");
  }

  if (ngDates.length > MAX_NG_DATES) {
    throw new Error(`選択できる日付は${MAX_NG_DATES}個までです`);
  }

  // 各日付の形式を検証
  for (const date of ngDates) {
    if (!isValidDateFormat(date)) {
      throw new Error("無効な日付形式が含まれています");
    }
  }

  // 重複チェック
  const uniqueDates = new Set(ngDates);
  if (uniqueDates.size !== ngDates.length) {
    throw new Error("重複した日付が含まれています");
  }
}

/**
 * 参加者名の検証
 */
export function validateParticipantName(name: string | undefined): string | undefined {
  // undefined または空文字列は許可（匿名参加）
  if (name === undefined || name === "") return undefined;

  if (typeof name !== "string") {
    throw new Error("名前は文字列である必要があります");
  }

  const trimmed = name.trim();

  // 空白のみの場合はundefinedを返す（匿名参加）
  if (trimmed === "") return undefined;

  if (trimmed.length > MAX_PARTICIPANT_NAME_LENGTH) {
    throw new Error(`名前は${MAX_PARTICIPANT_NAME_LENGTH}文字以内で入力してください`);
  }

  return trimmed;
}
