"use client";

import React, { useRef, useState, useContext } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { CardDrapeContext } from "@/store/context";

const tableHeight = 0;
const targetRotationX = Math.PI / 2;

// X-axis: Red dexia-aristera
// Y-axis: Green pano-kato
// Z-axis: Blue

const Card = () => {
	const {
		cards,
		setCards,
		activeCard,
		setActiveCard,
		playedCards,
		setPlayedCards,
	} = useContext(CardDrapeContext);

	const cardRef = useRef();
	const position = useRef([0, 2, 5]);

	const velocity = useRef([0, 0, 0]);
	const { size } = useThree();
	const [isDraging, setIsDraging] = useState(false);
	const [rotationX, setRotationX] = useState(0);
	const [isRotatingY, setIsRotatingY] = useState(false);
	const [texture, setTexture] = useState(null);

	const [isCardPlayed, setIsCardPlayed] = useState(false);

	const loader = new THREE.TextureLoader();
	loader.load(
		"https://card-drape-deck.s3.eu-north-1.amazonaws.com/diamonds-10.jpg", // External texture URL
		(loadedTexture) => {
			setTexture(loadedTexture); // Set texture once loaded
		},
		undefined,
		(err) => {
			console.error("An error occurred while loading the texture", err);
		}
	);

	const drag = useDrag(
		({ offset: [x, y], movement: [mx, my], down }) => {
			setIsDraging(down);

			if (down) {
				position.current = [x / size.height, 2 + -y / size.width, 5];
				velocity.current = [mx / 500, my / 500, my / 200];
			}
		},
		{
			pointer: { touch: true }, //touch same as mouse
			preventScroll: true, //no srcrolling
			filterTaps: true, //no taps allowed(mobile)
		}
	);

	useFrame((state, delta) => {
		//make the card horizontal
		if (
			velocity.current[2] !== 0 &&
			rotationX > -targetRotationX &&
			!isDraging
		) {
			const newRotationX = Math.min(rotationX - 0.15, targetRotationX); // rotation
			setRotationX(newRotationX);
			cardRef.current.rotation.x = newRotationX; // rotate card
			setIsRotatingY(true);
		}

		//card spin
		if (isRotatingY) {
			cardRef.current.rotation.z -= 0.35;
		}

		//card throw
		if (!isDraging && position.current[1] > tableHeight) {
			position.current[0] += velocity.current[0];
			position.current[1] += velocity.current[1];
			position.current[2] += velocity.current[2];

			velocity.current[0] *= 0.95;
			velocity.current[1] *= 0.95;
			velocity.current[2] *= 0.95;
		}

		//fix card on table
		if (position.current[1] <= tableHeight) {
			// reset position to table
			position.current[1] = tableHeight;
			// stop downward movement
			velocity.current[1] = 0;

			cardRef.current.rotation.x = targetRotationX;

			//when on table increase deceleration
			velocity.current[0] *= 0.7;
			velocity.current[2] *= 0.7;

			setIsRotatingY(false);
			setIsCardPlayed(true);
		}

		cardRef.current.position.lerp(new THREE.Vector3(...position.current), 0.2);

		if (position.current[1] === tableHeight && isCardPlayed && isActive) {
			console.log("carded landed");

			const disActivatedCard = {
				name: activeCard.name,
				isActive: false,
				isOnTable: true,
				cardFinalPosition: position.current,
				cardFinalRotation: [
					cardRef.current.rotation.x,
					cardRef.current.rotation.y,
					cardRef.current.rotation.z,
				],
				setCardFinalPosition: () => {},
			};

			playedCards.push(disActivatedCard);
			cards.shift();
			setCards(cards);
			setPlayedCards(playedCards);
			setActiveCard(null);
		}
	});

	//Math.PI / 8
	return (
		<mesh ref={cardRef} position={position.current} {...drag()}>
			<boxGeometry args={[0.2, 0.38, 0.01]} />
			<meshStandardMaterial map={texture} />
		</mesh>
	);
};

export default Card;
