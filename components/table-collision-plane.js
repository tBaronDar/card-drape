import { useBox } from "@react-three/cannon";

export default function TablePlane() {
	// Create a finite table surface using a box
	const [tableBoxRef] = useBox(() => ({
		args: [4, 0.2, 6], // Size: [width, height (thin), depth]
		position: [0, -0.05, 0], // Position in the scene
		rotation: [0, 0, 0], // Rotate to be flat like a table
	}));

	return (
		<mesh ref={tableBoxRef} receiveShadow>
			<boxGeometry args={[4, 0.1, 6]} rotation={[0, 0, 0]} />
			{/* Match the size of collision box */}
			<meshStandardMaterial visible={false} />
		</mesh>
	);
}
