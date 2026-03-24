import NextImage, { ImageProps } from "next/image";

export default function Image({ src, alt, ...props }: ImageProps) {
	return (
		<NextImage draggable={false} onContextMenu={(e) => e.preventDefault()} fill style={{ objectFit: "contain" }} src={src} alt={alt} {...props} />
	);
}
