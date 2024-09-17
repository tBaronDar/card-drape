"use client";

import React from "react";

function Table() {
	return (
		<group rotation={[-Math.PI / 2, 0, 0]}>
			//table
			<mesh position={[0, 0, 0]}>
				<boxGeometry args={[4, 6, -1]} />
				<meshBasicMaterial color={"green"} />
			</mesh>
			//forward left leg
			<mesh position={[-1.85, -2.5, -2]}>
				<boxGeometry args={[0.15, 0.15, -3]} />
				<meshBasicMaterial color={"yellow"} />
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
	);
}

export default Table;
