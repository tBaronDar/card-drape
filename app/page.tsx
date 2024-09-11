"use client";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Table from "@/components/table";
import Card from "@/components/card";
import { Vector3 } from "three";
import { useState } from "react";

import styles from "./page.module.css";

//Math.PI / 3.3

// X-axis: Red dexia
// Y-axis: Green pano
// Z-axis: Blue

export default function MainScene() {
	const [cameraManualControl, setCameraManualControls] = useState(false);
	return (
		<div>
			<button
				className={styles.controls}
				onClick={() => {
					setCameraManualControls(!cameraManualControl);
				}}>
				Camera Pan
			</button>
			<Canvas>
				<axesHelper args={[12]} />
				{cameraManualControl && <OrbitControls position={[0, 0, 0]} />}
				{!cameraManualControl && (
					<PerspectiveCamera
						makeDefault
						position={[0, 3, 6]}
						rotation={[Math.PI / -6, 0, 0]}
					/>
				)}
				<directionalLight position={[0, 0, 12]} intensity={0.2} />
				<Table />
				<Card />
			</Canvas>
		</div>
	);
}
