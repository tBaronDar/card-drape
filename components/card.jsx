"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

const tableHeight = 0;

const Card = () => {
	const cardRef = useRef();
	const position = useRef([0, 0, 2]);
	const velocity = useRef([0, 0]);
	const [isDraging, setIsDraging] = useState(false);

	const drag = useDrag(({ offset: [x, y], movement: [mx, my], down }) => {
		setIsDraging(down);

		if (down) {
			position.current = [x / 100, -y / 100, 2];
			velocity.current = [mx / 500, -my / 500];
		}
	});

	useFrame(() => {
		if (!isDraging) {
			position.current[0] += velocity.current[0];
			position.current[1] += velocity.current[1];

			velocity.current[0] *= 0.95;
			velocity.current[1] *= 0.95;
		}

		if (position.current[1] <= tableHeight) {
			position.current[1] = tableHeight; // Reset position to table height
			velocity.current[1] = 0; // Stop downward movement
		}

		cardRef.current.position.lerp(new THREE.Vector3(...position.current), 0.2);
	});

	return (
		<group position={[0, -5, 2]} rotation={[Math.PI / 8, 0, 0]}>
			<mesh ref={cardRef} position={position.current} {...drag()}>
				<boxGeometry args={[0.5, 0.5, 0.01]} />
				<meshStandardMaterial color={"red"} />
			</mesh>
		</group>
	);
};

export default Card;
