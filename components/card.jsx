"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

import image from "@/deck/diamonds-1.jpg";

const tableHeight = 0.5;
const targetRotation = Math.PI / 2;

// X-axis: Red dexia
// Y-axis: Green pano
// Z-axis: Blue

const Card = ({ cardIsDone }) => {
	const cardRef = useRef();
	const position = useRef([0, 2, 5]);

	const velocity = useRef([0, 0, 0]);
	const { size } = useThree();
	const [isDraging, setIsDraging] = useState(false);
	const [rotation, setRotation] = useState(0);

	const texture = useLoader(THREE.TextureLoader, "/deck/diamonds-1.jpg");

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
		if (velocity.current[2] !== 0 && rotation > -targetRotation && !isDraging) {
			const newRotation = Math.min(rotation - 0.1, targetRotation); // rotation
			setRotation(newRotation);
			cardRef.current.rotation.x = newRotation; // rotate card
		}
		if (!isDraging && position.current[1] >= tableHeight) {
			position.current[0] += velocity.current[0];
			position.current[1] += velocity.current[1];
			position.current[2] += velocity.current[2];

			velocity.current[0] *= 0.95;
			velocity.current[1] *= 0.95;
			velocity.current[2] *= 0.95;
		}

		if (position.current[1] <= tableHeight) {
			position.current[1] = tableHeight; // reset position to table
			velocity.current[1] = 0; // stop downward movement
		}

		//when on table increase deceleration
		if (position.current[1] === tableHeight) {
			velocity.current[0] *= 0.7;
			velocity.current[2] *= 0.7;
		}

		if (position.current[1] === tableHeight) {
			cardIsDone();
		}

		cardRef.current.position.lerp(new THREE.Vector3(...position.current), 0.2);
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
