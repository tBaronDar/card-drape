"use client";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Table from "@/components/table";
import Card from "@/components/card";
import { Euler, Vector3 } from "three";
import { useContext, useEffect, useState } from "react";

import styles from "./page.module.css";
import { CardDrapeContext } from "@/store/context";
import PlayedCard from "@/components/played-card";

// X-axis: Red dexia
// Y-axis: Green pano
// Z-axis: Blue

export default function MainScene() {
	const { cards, setCards, activeCard, playedCards } =
		useContext(CardDrapeContext);

	const [isCameraClicked, setIsCameraClicked] = useState(false);
	const [cameraManualControl, setCameraManualControls] = useState(false);
	// let cameraVectors = {
	// position: new Vector3(0, 3, 6),
	// rotation: new Euler(Math.PI / -6, 0, 0),
	// };
	let cameraZoom1 = false;
	if (window.screen.width < 738) {
		// cameraVectors = {
		// 	position: new Vector3(0, 3, 10),
		// 	rotation: new Euler(Math.PI / -6, 0, 0),
		// };
		cameraZoom1 = true;
	}

	// const [cameraZoom, setCameraPosition] = useState(cameraZoom1);
	// console.log(cards);

	return (
		<div>
			<h3 className={styles.text}>Dev tools</h3>
			<button
				className={styles[isCameraClicked ? "button-clicked" : "controls"]}
				onClick={() => {
					setIsCameraClicked(!isCameraClicked);
					setCameraManualControls(!cameraManualControl);
				}}>
				Camera Pan
			</button>
			<button className={styles.controls}>New Card</button>
			<Canvas>
				<axesHelper args={[12]} />
				<spotLight position={[0, 5, -5]} visible />
				<directionalLight position={[0, 5, 0]} intensity={0.2} />
				<ambientLight intensity={0.15} />
				<Table />
				{cameraManualControl && <OrbitControls position={[0, 4, 6]} />}
				{!cameraManualControl && (
					<PerspectiveCamera
						makeDefault
						position={[0, 3, 6.5]}
						rotation={[Math.PI / -6, 0, 0]}
					/>
				)}
				{/* {!cameraManualControl && cameraZoom && (
					<PerspectiveCamera
						makeDefault
						position={[0, 3, 6.5]}
						rotation={[Math.PI / -6, 0, 0]}
					/>
				)} */}
				{/* this is the card that you see */}
				{activeCard && activeCard.isActive === true && (
					<Card key={activeCard.name} />
				)}
				{/* this is an array with the cards on the table */}
				{playedCards.length > 0 &&
					playedCards?.map((card) => (
						<PlayedCard
							key={card.name}
							position={card.cardFinalPosition}
							rotation={card.cardFinalRotation}
							texture={null}
						/>
					))}
			</Canvas>
		</div>
	);
}
