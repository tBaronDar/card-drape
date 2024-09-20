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

const Card = React.memo(({ dealer, activeCard }) => {
	const cardRef = useRef({
		position: new THREE.Vector3(0, 2, 5),
		rotation: [Math.PI / 1.4, 0, 0],
	});

	// cardRef.current.position = new THREE.Vector3(0, 2, 5);
	// cardRef.current.rotation = ;
	// const [position, setPosition] = useState(new THREE.Vector3(0, 2, 5));

	const velocity = useRef([0, 0, 0]);
	const { size } = useThree();
	const [isDragging, setIsDragging] = useState(false);
	const [rotationX, setRotationX] = useState(0);
	const [isRotatingY, setIsRotatingY] = useState(false);
	const [isCardPlayed, setIsCardPlayed] = useState(false);

	// useEffect(() => {
	// 	const handleTouchStart = (event) => {
	// 		console.log("Touch started", event);
	// 	};

	// 	window.addEventListener("pointerdown", handleTouchStart);

	// 	return () => {
	// 		window.removeEventListener("pointerdown", handleTouchStart);
	// 	};
	// }, []);

	const drag = useDrag(
		({ offset: [x, y], movement: [mx, my], down }) => {
			setIsDragging(down);
			// Update position when dragging
			if (down) {
				cardRef.current.position.set(x / size.height, 2 + -y / size.width, 5);
				velocity.current = [mx / 500, my / 500, my / 200];
			}
		},
		{
			// Enable touch
			// pointer: { touch: true, mouse: true },
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
		if (!isDragging && cardRef.current.position.y > tableHeight) {
			cardRef.current.position.x += velocity.current[0];
			cardRef.current.position.y += velocity.current[1];
			cardRef.current.position.z += velocity.current[2];

			velocity.current[0] *= 0.95;
			velocity.current[1] *= 0.95;
			velocity.current[2] *= 0.95;
		}

		//fix card on table
		if (cardRef.current.position.y <= tableHeight) {
			// reset position to table
			cardRef.current.position.y = tableHeight;
			// stop downward movement
			velocity.current[1] = 0;

			cardRef.current.rotation.x = targetRotationX;

			//when on table increase deceleration
			velocity.current[0] *= 0.7;
			velocity.current[2] *= 0.7;

			setIsCardPlayed(true);
		}

		cardRef.current.position.lerp(cardRef.current.position, 0.2);

		if (
			cardRef.current.position.y === tableHeight &&
			isCardPlayed &&
			activeCard.isActive
		) {
			dealer({
				position: cardRef.current.position,
				rotation: [
					cardRef.current.rotation.x,
					cardRef.current.rotation.y,
					cardRef.current.rotation.z,
				],
			});
			console.log("carded landed");
		}
	});
	console.log(cardRef.current.position);
	// console.log(cardRef.current);

	//Math.PI / 8
	return (
		<mesh
			{...drag()}
			ref={cardRef}
			position={new THREE.Vector3(0, 2, 5)}
			rotation={[Math.PI / 1.4, 0, 0]}>
			<boxGeometry args={[0.2, 0.38, 0.01]} />
			<meshStandardMaterial color={"black"} />
		</mesh>
	);
});

export default Card;
