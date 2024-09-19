"use client";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Table from "@/components/table";
import Card from "@/components/card";
import { Euler, Vector3 } from "three";
import { useEffect, useState } from "react";
import { dummyCards } from "@/store/context";

import styles from "./page.module.css";

import PlayedCard from "@/components/played-card";

export default function MainScene() {
	const [cards, setCards] = useState(dummyCards);
	const [activeCard, setActiveCard] = useState();
	const [playedCards, setPlayedCards] = useState([]);
	const [isCameraClicked, setIsCameraClicked] = useState(false);
	const [cameraManualControl, setCameraManualControls] = useState(false);

	useEffect(() => {
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
						position={[0, 3, 6]}
						rotation={[Math.PI / -6, 0, 0]}
					/>
				)}
				{/* this is the card that you see */}
				{activeCard && <Card activeCard={activeCard} dealer={dealer} />}
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
			</Canvas>
		</div>
	);
}
