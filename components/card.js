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
	const [position, setPosition] = useState(new THREE.Vector3(0, 2, 5));

	const velocity = useRef([0, 0, 0]);
	const { size } = useThree();
	const [isDragging, setIsDragging] = useState(false);
	const [rotationX, setRotationX] = useState(0);
	const [isRotatingY, setIsRotatingY] = useState(false);
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
				setPosition(position.set(x / size.height, 2 + -y / size.width, 5));
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
		if (!isDragging && position.y > tableHeight) {
			position.x += velocity.current[0];
			position.y += velocity.current[1];
			position.z += velocity.current[2];

			velocity.current[0] *= 0.95;
			velocity.current[1] *= 0.95;
			velocity.current[2] *= 0.95;
		}

		//fix card on table
		if (position.y <= tableHeight) {
			// reset position to table
			position.y = tableHeight;
			// stop downward movement
			velocity.current[1] = 0;

			cardRef.current.rotation.x = targetRotationX;

			//when on table increase deceleration
			velocity.current[0] *= 0.7;
			velocity.current[2] *= 0.7;

			setIsCardPlayed(true);
		}

		cardRef.current.position.lerp(position, 0.2);

		if (position.y === tableHeight && isCardPlayed && activeCard.isActive) {
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
	console.log(position);
	console.log(cardRef.current);

	//Math.PI / 8
	return (
		<group
			{...drag()}
			ref={cardRef}
			position={position}
			rotation={[Math.PI / 1.4, 0, 0]}>
			<mesh>
				<boxGeometry args={[0.2, 0.38, 0.01]} />
				<meshStandardMaterial color={"black"} />
			</mesh>
		</group>
	);
};

export default Card;
