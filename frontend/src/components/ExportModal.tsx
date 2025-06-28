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
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  sortConfig: { key: string; direction: string };
  search: string;
}

interface Column {
    id: UniqueIdentifier;
    name: string;
}

const allColumns: Column[] = [
    { id: '_id', name: 'Transaction ID' },
    { id: 'date', name: 'Date' },
    { id: 'amount', name: 'Amount' },
    { id: 'category', name: 'Category' },
    { id: 'status', name: 'Status' },
    { id: 'user_id', name: 'User ID' },
];

const initialSelectedColumns: Column[] = [
    { id: 'user_id', name: 'User ID' },
    { id: 'date', name: 'Date' },
    { id: 'amount', name: 'Amount' },
    { id: 'category', name: 'Category' },
    { id: 'status', name: 'Status' },
];

const initialAvailableColumns: Column[] = allColumns.filter(
    col => !initialSelectedColumns.some(sel => sel.id === col.id)
);

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, filters, sortConfig, search }) => {
  const [availableColumns, setAvailableColumns] = useState(initialAvailableColumns);
  const [selectedColumns, setSelectedColumns] = useState<Column[]>(initialSelectedColumns);
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // Find the containers for the active and over items
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer) {
      return;
    }

    // If over.id is a container, findContainer returns null. 
    // In that case, the container ID is over.id itself.
    const destinationContainerId = overContainer || overId;

    // Handle reordering within the same container
    if (activeContainer === destinationContainerId) {
      const items = activeContainer === 'available' ? availableColumns : selectedColumns;
      const setItems = activeContainer === 'available' ? setAvailableColumns : setSelectedColumns;
      
      const oldIndex = items.findIndex(item => item.id === activeId);
      const newIndex = items.findIndex(item => item.id === overId);

      if (oldIndex !== newIndex && newIndex !== -1) {
        setItems(currentItems => arrayMove(currentItems, oldIndex, newIndex));
      }
    } else {
      // Handle moving to a different container
      const activeItem = [...availableColumns, ...selectedColumns].find(item => item.id === activeId);
      if (!activeItem) {
        return;
      }

      // Remove from the source container
      if (activeContainer === 'available') {
        setAvailableColumns(items => items.filter(item => item.id !== activeId));
      } else {
        setSelectedColumns(items => items.filter(item => item.id !== activeId));
      }

      // Add to the destination container
      if (destinationContainerId === 'available') {
        const overIndex = availableColumns.findIndex(item => item.id === overId);
        const newIndex = overIndex !== -1 ? overIndex : availableColumns.length;
        setAvailableColumns(items => {
          const newItems = [...items];
          newItems.splice(newIndex, 0, activeItem);
          return newItems;
        });
      } else if (destinationContainerId === 'selected') {
        const overIndex = selectedColumns.findIndex(item => item.id === overId);
        const newIndex = overIndex !== -1 ? overIndex : selectedColumns.length;
        setSelectedColumns(items => {
          const newItems = [...items];
          newItems.splice(newIndex, 0, activeItem);
          return newItems;
        });
      }
    }
  };

  const findContainer = (id: UniqueIdentifier) => {
      if (availableColumns.some(item => item.id === id)) return 'available';
      if (selectedColumns.some(item => item.id === id)) return 'selected';
      return null;
  }

  const handleExport = async () => {
    if (!user?.token) {
      toast.error('Authentication token not found.');
      return;
    }
    setIsExporting(true);
    toast.loading('Exporting CSV...');

    try {
      const exportConfig = {
        columns: selectedColumns.map(c => c.id),
        filters,
        sort: sortConfig,
        search,
      };

      const response = await axios.post('http://localhost:3001/api/transactions/export', exportConfig, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        responseType: 'blob', // Important for file downloads
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'transactions.csv';
      if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (filenameMatch.length > 1) {
              filename = filenameMatch[1];
          }
      }
      link.setAttribute('download', filename);
      
      // Append to html link element page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up and remove the link
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success('CSV exported successfully!');
      onClose();

    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export CSV.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

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
              <div id="available" className="bg-[var(--color-background)] p-4 rounded-lg min-h-[250px]">
                <SortableContext items={availableColumns.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {availableColumns.map(col => <SortableItem key={col.id} id={col.id}>{col.name}</SortableItem>)}
                </SortableContext>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-center">Columns to Export</h3>
              <div id="selected" className="bg-[var(--color-background)] p-4 rounded-lg min-h-[250px]">
                <SortableContext items={selectedColumns.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {selectedColumns.map(col => <SortableItem key={col.id} id={col.id}>{col.name}</SortableItem>)}
                </SortableContext>
              </div>
            </div>
          </div>
        </DndContext>
        <div className="flex justify-end mt-8 space-x-4">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg bg-[var(--color-background)] hover:opacity-90 transition-opacity" disabled={isExporting}>
            Cancel
          </button>
          <button onClick={handleExport} className="px-5 py-2.5 rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition-opacity font-semibold text-white disabled:opacity-50" disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 