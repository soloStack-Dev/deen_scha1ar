export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <view className="toast">
      <text className="toast__text">{message}</text>
    </view>
  );
}
