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
	const [position, setPosition] = useState([0, 2, 5]);

	const velocity = useRef([0, 0, 0]);
	const { size } = useThree();
	const [isDragging, setIsDragging] = useState(false);
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
			setIsDragging(down);
			// Update position when dragging
			if (down) {
				setPosition([x / size.height, 2 + -y / size.width, 5]);
				velocity.current = [mx / 500, my / 500, my / 200];
			}
		},
		{
			pointer: { touch: true }, // Enable touch
			preventScroll: true,
			filterTaps: true,
		}
	);

	useFrame((state, delta) => {
		//make the card horizontal
		if (
			velocity.current[2] !== 0 &&
			rotationX > -targetRotationX &&
			!isDragging
		) {
			const newRotationX = Math.min(rotationX - 0.15, targetRotationX); // rotation
			setRotationX(newRotationX);
			cardRef.current.rotation.x = newRotationX; // rotate card
			//card spin
			cardRef.current.rotation.z -= 0.35;
		}

		//card throw
		if (!isDragging && position[1] > tableHeight) {
			position[0] += velocity.current[0];
			position[1] += velocity.current[1];
			position[2] += velocity.current[2];

			velocity.current[0] *= 0.95;
			velocity.current[1] *= 0.95;
			velocity.current[2] *= 0.95;
		}

		//fix card on table
		if (position[1] <= tableHeight) {
			// reset position to table
			position[1] = tableHeight;
			// stop downward movement
			velocity.current[1] = 0;

			cardRef.current.rotation.x = targetRotationX;

			//when on table increase deceleration
			velocity.current[0] *= 0.7;
			velocity.current[2] *= 0.7;

			setIsCardPlayed(true);
		}

		cardRef.current.position.lerp(new THREE.Vector3(...position), 0.2);

		if (position[1] === tableHeight && isCardPlayed && activeCard.isActive) {
			dealer({
				position: position,
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
		<mesh {...drag()} ref={cardRef} position={position}>
			<boxGeometry args={[0.2, 0.38, 0.01]} />
			<meshStandardMaterial color={"black"} />
		</mesh>
	);
};

export default Card;
