import { trpc } from "../trpc/trpc.ts";
import { useTw } from "../hooks/useTw.ts";

export default function Post({ id }: { id: number }) {
  const { data } = trpc.post.get.useQuery({ id });
  const tw = useTw();
  return (
    <div>
      <div className={tw("p-3")}>{data?.title}</div>
      Post {data?.id}
    </div>
  );
}
