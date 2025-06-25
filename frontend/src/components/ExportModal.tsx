import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Column {
    id: UniqueIdentifier;
    name: string;
}

const initialAvailableColumns: Column[] = [
  { id: 'transactionId', name: 'Transaction ID' },
  { id: 'status', name: 'Status' },
  { id: 'user', name: 'User' },
  { id: 'category', name: 'Category' },
];

const initialSelectedColumns: Column[] = [
    { id: 'date', name: 'Date' },
    { id: 'amount', name: 'Amount' },
    { id: 'description', name: 'Description' },
];


const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [availableColumns, setAvailableColumns] = useState(initialAvailableColumns);
  const [selectedColumns, setSelectedColumns] = useState<Column[]>(initialSelectedColumns);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
        const items = activeContainer === 'available' ? availableColumns : selectedColumns;
        const setItems = activeContainer === 'available' ? setAvailableColumns : setSelectedColumns;
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        if (oldIndex !== newIndex) {
            setItems(arrayMove(items, oldIndex, newIndex));
        }
    } else {
        const activeItem = [...availableColumns, ...selectedColumns].find(item => item.id === active.id);
        if(!activeItem) return;

        if (activeContainer === 'available') {
            setAvailableColumns(items => items.filter(item => item.id !== active.id));
            setSelectedColumns(items => [...items, activeItem]);
        } else {
            setSelectedColumns(items => items.filter(item => item.id !== active.id));
            setAvailableColumns(items => [...items, activeItem]);
        }
    }
  };

  const findContainer = (id: UniqueIdentifier) => {
      if (availableColumns.some(item => item.id === id)) return 'available';
      if (selectedColumns.some(item => item.id === id)) return 'selected';
      return null;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[var(--color-surface)] rounded-lg p-6 w-full max-w-2xl text-white">
        <h2 className="text-xl font-bold mb-4">Export to CSV</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Drag and drop to select and reorder the columns you want to export.
        </p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-center">Available Columns</h3>
              <div className="bg-[var(--color-background)] p-4 rounded-lg min-h-[250px]">
                <SortableContext items={availableColumns.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {availableColumns.map(col => <SortableItem key={col.id} id={col.id}>{col.name}</SortableItem>)}
                </SortableContext>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-center">Columns to Export</h3>
              <div className="bg-[var(--color-background)] p-4 rounded-lg min-h-[250px]">
                <SortableContext items={selectedColumns.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {selectedColumns.map(col => <SortableItem key={col.id} id={col.id}>{col.name}</SortableItem>)}
                </SortableContext>
              </div>
            </div>
          </div>
        </DndContext>
        <div className="flex justify-end mt-8 space-x-4">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg bg-[var(--color-background)] hover:opacity-90 transition-opacity">
            Cancel
          </button>
          <button className="px-5 py-2.5 rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition-opacity font-semibold text-white">
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 