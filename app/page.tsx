"use client";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Table from "@/components/table";
import Card from "@/components/card";

export default function MainScene() {
	return (
		<Canvas>
			{/* <OrbitControls /> */}
			<PerspectiveCamera
				makeDefault
				position={[0, -6.8, 5]}
				rotation={[Math.PI / 3.3, 0, 0]}
			/>
			<directionalLight position={[0, 0, 12]} intensity={0.2} />
			<Table />
			<Card />
		</Canvas>
	);
}
