import { tw } from "./twind.ts";

export default function Post({ color }: { color?: string }) {
  return (
    <div className={tw`text(3xl white) bg-${color || "blue"}-500 p-3`}>
      Hello with-twind!
    </div>
  );
}
