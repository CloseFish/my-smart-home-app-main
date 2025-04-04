"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faDoorOpen, faMoon, faFilm, faUsers, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
	DndContext,
	closestCenter,
	useSensor,
	useSensors,
	PointerSensor,
	TouchSensor,
} from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableScenes: React.FC = () => {
	const [scenes, setScenes] = useState([
		{ id: "home", name: "回家模式", icon: faHome },
		{ id: "away", name: "离家模式", icon: faDoorOpen },
		{ id: "sleep", name: "睡眠模式", icon: faMoon },
		{ id: "cinema", name: "影院模式", icon: faFilm },
		{ id: "guest", name: "会客模式", icon: faUsers },
	]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
	);

	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (active.id !== over.id) {
			setScenes((prev) => {
				const oldIndex = prev.findIndex((scene) => scene.id === active.id);
				const newIndex = prev.findIndex((scene) => scene.id === over.id);
				return arrayMove(prev, oldIndex, newIndex);
			});
		}
	};

	return (
		<div>
			<h2 className="text-lg font-medium mb-4">智能场景</h2>
			<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
				<SortableContext items={scenes.map((scene) => scene.id)} strategy={rectSortingStrategy}>
					<div className="space-y-4">
						{scenes.map((scene) => (
							<SortableScene key={scene.id} id={scene.id} name={scene.name} icon={scene.icon} />
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
};

const SortableScene: React.FC<{ id: string; name: string; icon: any }> = ({ id, name, icon }) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	return (
		<Button
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			variant="outline"
			className="w-full h-auto py-4 flex items-center gap-4 rounded-lg cursor-grab active:cursor-grabbing"
			style={{
				transform: CSS.Transform.toString(transform),
				transition
			}}
		>
			<div className="w-12 h-12 rounded-full bg-[#F6EBE1] flex items-center justify-center">
				<FontAwesomeIcon icon={icon} className="text-[#B07C5B] text-lg" />
			</div>
			<span className="flex-1 text-left">{name}</span>
			<FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
		</Button>
	);
};

export default SortableScenes;
