"use client";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";

function Table() {
	return (
		<Canvas>
			<OrbitControls />
			<PerspectiveCamera
				makeDefault
				position={[2, -10, 0]}
				rotation={[Math.PI / 2, 0, 0]}
			/>
			<directionalLight position={[0, 0, 5]} />
			<group>
				//table
				<mesh position={[0, 0, 0]}>
					<boxGeometry args={[4, 6, 1]} />
					<meshBasicMaterial color={"green"} />
				</mesh>
				//forward left leg
				<mesh position={[-1.85, -2.5, -2]}>
					<boxGeometry args={[0.15, 0.15, -3]} />
					<meshBasicMaterial color={"brown"} />
				</mesh>
				//forward right leg
				<mesh position={[1.85, -2.5, -2]}>
					<boxGeometry args={[0.15, 0.15, -3]} />
					<meshBasicMaterial color={"brown"} />
				</mesh>
				//back left leg
				<mesh position={[-1.85, 2.5, -2]}>
					<boxGeometry args={[0.15, 0.15, -3]} />
					<meshBasicMaterial color={"brown"} />
				</mesh>
				//back right leg
				<mesh position={[1.85, 2.5, -2]}>
					<boxGeometry args={[0.15, 0.15, -3]} />
					<meshBasicMaterial color={"brown"} />
				</mesh>
			</group>
		</Canvas>
	);
}

export default Table;
