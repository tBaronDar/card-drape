"use client";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Table from "@/components/table";
import Card from "@/components/card";
import { Vector3 } from "three";
import { useState } from "react";

import styles from "./page.module.css";
import { redirect } from "next/navigation";

// X-axis: Red dexia
// Y-axis: Green pano
// Z-axis: Blue

export default function MainScene() {
	//redirect if in mobile
	// if (window.screen.width < 738) {
	// 	return redirect("/mobile");
	// }

	const [cameraManualControl, setCameraManualControls] = useState(false);

	const [cards, setCards] = useState([{ id: 1 }]);

	//fcn that brings in a new card
	const newCardHandler = () => {
		const newId = cards.length + 1;
		setCards([...cards, { id: newId }]);
	};
	return (
		<div>
			<button
				className={styles.controls}
				onClick={() => {
					setCameraManualControls(!cameraManualControl);
				}}>
				Camera Pan
			</button>
			<button className={styles.controls} onClick={newCardHandler}>
				New Card
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
				<directionalLight position={[0, 12, 0]} intensity={0.2} />
				<ambientLight intensity={0.15} />
				<Table />
				{cards.map((card) => (
					<Card key={card.id} cardIsDone={newCardHandler} />
				))}
			</Canvas>
		</div>
	);
}
