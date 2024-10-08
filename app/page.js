"use client";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Table from "@/components/table";
import Card from "@/components/card";
import { useEffect, useState, useCallback } from "react";
import { dummyCards } from "@/dummy-data";
import { Physics } from "@react-three/cannon";

import styles from "./page.module.css";

import PlayedCard from "@/components/played-card";
import TablePlane from "@/components/table-collision-plane";

export default function MainScene() {
	const [isCameraClicked, setIsCameraClicked] = useState(false);
	const [cameraManualControl, setCameraManualControls] = useState(false);
	const [FOV, setFOV] = useState(55);
	const [canvasSize, setCanvasize] = useState([720, 720]);
	const [gravity, setGravity] = useState([0, 0, 0]);

	//cards state
	const [cards, setCards] = useState([]);
	const [playedCards, setPlayedCards] = useState([]);
	const [activeCardIndex, setActiveCardIndex] = useState(0);

	useEffect(() => {
		if (window.width < 768) {
			setFOV(50);
			setCanvasize([360, 360]);
		}
		setCards(dummyCards);
	}, []);

	function activateGravity() {
		setGravity([0, -9.8, 0]);
	}

	const handleCardCollision = useCallback((position, rotation, cardId) => {
		// setPlayedCards((prev) => [ { id: cardId, position, rotation },...prev]);
		playedCards.push({ id: cardId, position, rotation });
		setPlayedCards(playedCards);
		// Move to the next card, if available
		let newIndex = activeCardIndex;
		if (activeCardIndex < cards.length - 1) {
			newIndex = activeCardIndex + 1;
		}

		setActiveCardIndex(newIndex);
		console.log(playedCards);
	}, []);

	return (
		<div className={styles.master}>
			<div className={styles.controls}>
				<h3>Dev tools</h3>
				<button
					className={styles[isCameraClicked ? "button-clicked" : "button"]}
					onClick={() => {
						setIsCameraClicked(!isCameraClicked);
						setCameraManualControls(!cameraManualControl);
					}}>
					Camera Pan
				</button>
				<button className={styles.button}>New Card</button>
			</div>

			<div className={styles["game-area"]}>
				<Canvas style={{ touchAction: "none" }}>
					<Physics
						gravity={gravity}
						allowSleep={false}
						iterations={32}
						tolerance={0.001}
						broadphase="SAP">
						<axesHelper args={[12]} />
						<spotLight position={[0, 5, -5]} />
						<directionalLight position={[0, 5, 0]} intensity={0.2} />
						<ambientLight intensity={0.15} />
						<TablePlane />
						<Table />
						{cameraManualControl && <OrbitControls position={[0, 4, 7]} />}
						{!cameraManualControl && (
							<PerspectiveCamera
								fov={FOV}
								makeDefault
								position={[0, 3, 6.2]}
								rotation={[Math.PI / -7, 0, 0]}
							/>
						)}
						{/* this is the card that you see */}
						{activeCardIndex < cards.length && (
							<Card
								key={cards[activeCardIndex].id}
								canvasSize={canvasSize}
								activateGravity={activateGravity}
								initialPosition={cards[activeCardIndex].position}
								isDraggable={true} // Only the active card is draggable
								cardId={cards[activeCardIndex].id}
								onCollision={handleCardCollision}
							/>
						)}
					</Physics>
					{/* this is an array with the cards on the table */}
					{playedCards.length > 0 &&
						playedCards.map((card) => (
							<PlayedCard
								key={`played_${card.id}`}
								position={card.position}
								rotation={card.rotation}
								isDraggable={false}
							/>
						))}
				</Canvas>
			</div>
		</div>
	);
}
