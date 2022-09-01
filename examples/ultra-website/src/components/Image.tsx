import useAsset from "ultra/hooks/use-asset.js";

const Image = ({ src, alt }: { src: string; alt: string }) => {
  return <img src={useAsset(src)} alt={alt} />;
};

export default Image;
