"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
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
	// const { size } = useThree();
	const [isDraging, setIsDraging] = useState(false);
	const [rotationX, setRotationX] = useState(0);
	// const [isRotatingY, setIsRotatingY] = useState(false);
	const [isCardPlayed, setIsCardPlayed] = useState(false);

	useEffect(() => {
		const handleTouchStart = (event) => {
			console.log("Touch started", event);
		};

		window.addEventListener("pointerdown", handleTouchStart);

		return () => {
			window.removeEventListener("pointerdown", handleTouchStart);
		};
	}, []);

	const drag = useDrag(
		({ offset: [x, y], movement: [mx, my], down }) => {
			// console.log(down, { x, y, mx, my });
			if (down) {
				position.current = [x / 500, 2 + -y / 500, 5];
				velocity.current = [mx / 500, my / 500, my / 200];
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
			<meshStandardMaterial color={"black"} />
		</mesh>
	);
};

export default Card;
