"use client";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Table from "@/components/table";
import Card from "@/components/card";
import { useEffect, useState } from "react";
import { dummyCards } from "@/dummy-data";
import { Physics } from "@react-three/cannon";

import styles from "./page.module.css";

import PlayedCard from "@/components/played-card";
import TablePlane from "@/components/table-collision-plane";

export default function MainScene() {
	const [cards, setCards] = useState(dummyCards);
	const [activeCard, setActiveCard] = useState();
	const [playedCards, setPlayedCards] = useState([]);
	const [isCameraClicked, setIsCameraClicked] = useState(false);
	const [cameraManualControl, setCameraManualControls] = useState(false);
	const [FOV, setFOV] = useState(55);
	const [canvasSize, setCanvasize] = useState([720, 720]);

	useEffect(() => {
		if (window.width < 768) {
			setFOV(50);
			setCanvasize([360, 360]);
		}
		if (cards.length > 0) {
			if (!activeCard) {
				// dealNewCard
				const newSelectedCard = cards[0];
				newSelectedCard.isActive = true;

				setActiveCard(newSelectedCard);
			}
		}
	}, [activeCard, cards]);

	function dealer({ position, rotation }) {
		const disActivatedCard = {
			name: activeCard.name,
			isActive: false,
			isOnTable: true,
			cardFinalPosition: position,
			cardFinalRotation: rotation,
		};

		playedCards.push(disActivatedCard);
		cards.shift();
		setCards(cards);
		setPlayedCards(playedCards);
		setActiveCard(null);
	}

	return (
		<div className={styles.master}>
			<div className={styles["side-area-left"]}>
				<div>
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
			</div>
			<div className={styles["game-area"]}>
				<Canvas style={{ touchAction: "none" }}>
					<Physics
						gravity={[0, -9.8, 0]}
						allowSleep={false}
						iterations={16}
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
								position={[0, 3, 6]}
								rotation={[Math.PI / -6, 0, 0]}
							/>
						)}
						{/* this is the card that you see */}
						{activeCard && (
							<Card
								activeCard={activeCard}
								dealer={dealer}
								canvasSize={canvasSize}
							/>
						)}
						{/* this is an array with the cards on the table */}
						{playedCards.length > 0 &&
							playedCards.map((card) => (
								<PlayedCard
									key={card.name}
									position={card.cardFinalPosition}
									rotation={card.cardFinalRotation}
									texture={null}
								/>
							))}
					</Physics>
				</Canvas>
				<div className={styles["side-area-right"]}></div>
			</div>
		</div>
	);
}
