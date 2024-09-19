"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

const tableHeight = 0;
const targetRotationX = Math.PI / 2;

// X-axis: Red dexia-aristera
// Y-axis: Green pano-kato
// Z-axis: Blue

const Card = ({ dealer, activeCard }) => {
	const cardRef = useRef();
	const position = useRef([0, 2, 5]);

	const velocity = useRef([0, 0, 0]);
	const { size } = useThree();
	const [isDraging, setIsDraging] = useState(false);
	const [rotationX, setRotationX] = useState(0);
	// const [isRotatingY, setIsRotatingY] = useState(false);
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
			if (down) {
				position.current = [x / size.height, 2 + -y / size.width, 5];
				velocity.current = [mx / 500, my / 500, my / 200];
				console.log("dragging :", { x, y, mx, my });
			}
			setIsDraging(down);
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
			//card spin
			cardRef.current.rotation.z -= 0.35;
		}

		// if (isRotatingY) {
		// 	cardRef.current.rotation.z -= 0.35;
		// }

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

			setIsCardPlayed(true);
		}

		cardRef.current.position.lerp(new THREE.Vector3(...position.current), 0.2);

		if (
			position.current[1] === tableHeight &&
			isCardPlayed &&
			activeCard.isActive
		) {
			dealer({
				position: position.current,
				rotation: [
					cardRef.current.rotation.x,
					cardRef.current.rotation.y,
					cardRef.current.rotation.z,
				],
			});
			console.log("carded landed");
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
