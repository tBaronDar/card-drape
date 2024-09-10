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
				position={[0, 0, 10]}
				rotation={[0, 0, 0]}
			/>
			<directionalLight position={[0, 0, 5]} intensity={0.2} />
			<Table />
			<Card position={[0, -2, 1]} />
		</Canvas>
	);
}
