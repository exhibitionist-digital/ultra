import { trpc } from "../trpc/trpc.ts";
import { tw } from "../twind.ts";

export default function Post({ id }: { id: number }) {
  const { data } = trpc.post.get.useQuery({ id });
  return (
    <div>
      <div className={tw("p-3")}>{data?.title}</div>
      Post {data?.id}
    </div>
  );
}
