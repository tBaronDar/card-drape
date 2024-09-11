"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

const tableHeight = 0;

// X-axis: Red dexia
// Y-axis: Green pano
// Z-axis: Blue

const Card = () => {
	const cardRef = useRef();
	const position = useRef([0, 2, 4.5]);

	const velocity = useRef([0, 0, 0]);
	const [isDraging, setIsDraging] = useState(false);
	// const [rotation, setRotation] = useState([0, 0, 0]);

	const rotation = [0, 0, 0];
	const drag = useDrag(({ offset: [x, y], movement: [mx, my], down }) => {
		setIsDraging(down);

		if (down) {
			position.current = [x / 100, 2 + -y / 100, 4.5];
			velocity.current = [mx / 500, my / 500, my / 200];
		}
	});

	useFrame((state, delta) => {
		console.log(cardRef.current.rotation.x);
		// if (rotation[0] >= 0) {
		// 	cardRef.current.rotation.x -= delta;
		// }
		if (!isDraging) {
			position.current[0] += velocity.current[0];
			position.current[1] += velocity.current[1];
			position.current[2] += velocity.current[2];

			velocity.current[0] *= 0.95;
			velocity.current[1] *= 0.95;
			velocity.current[2] *= 0.95;
		}

		// if (position.current[1] <= tableHeight) {
		// 	position.current[1] = tableHeight; // Reset position to table height
		// 	velocity.current[1] = 0; // Stop downward movement
		// }

		cardRef.current.position.lerp(new THREE.Vector3(...position.current), 0.2);
	});

	//Math.PI / 8
	return (
		<mesh ref={cardRef} position={position.current} {...drag()}>
			<boxGeometry args={[0.5, 0.5, 0.01]} />
			<meshStandardMaterial color={"red"} />
		</mesh>
	);
};

export default Card;
