// when a user clicks export csv, where the csv is huge with lakhs of transactions
// thats a potentially long running task where a layman approach would fail
// we have defined a separate asynchronus background job where the server adds the job to a queue (bullmq)
// a separate worker process starts in the background and this allows user to continue using the application without interruption
// the frontend polls the server with the jobID which is basically like asking the server if the job is done yet
// once the server confirms that the job is done, the frontend receives a url which is clicked automatically 
// which then triggers a download in user's browser



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

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer) {
      return;
    }

    const destinationContainerId = overContainer || overId;

    if (activeContainer === destinationContainerId) {
      const items = activeContainer === 'available' ? availableColumns : selectedColumns;
      const setItems = activeContainer === 'available' ? setAvailableColumns : setSelectedColumns;
      
      const oldIndex = items.findIndex(item => item.id === activeId);
      const newIndex = items.findIndex(item => item.id === overId);

      if (oldIndex !== newIndex && newIndex !== -1) {
        setItems(currentItems => arrayMove(currentItems, oldIndex, newIndex));
      }
    } else {
   
      const activeItem = [...availableColumns, ...selectedColumns].find(item => item.id === activeId);
      if (!activeItem) {
        return;
      }

      
      if (activeContainer === 'available') {
        setAvailableColumns(items => items.filter(item => item.id !== activeId));
      } else {
        setSelectedColumns(items => items.filter(item => item.id !== activeId));
      }

     
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
    toast.loading('Queueing export job...');

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
      });

      toast.dismiss();
      toast.success(`Export started! We'll notify you when it's ready.`);
      onClose();

      const { jobId } = response.data;
      pollForCompletion(jobId);

    } catch (error) {
      toast.dismiss();
      toast.error('Failed to start export job.');
      console.error('Export queuing error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const pollForCompletion = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/export-status/${jobId}`);

        if (data.status === 'completed') {
          clearInterval(interval);
          if (data.url) {
            toast.success('Your CSV is ready for download!');
           
            const link = document.createElement('a');
            link.href = `http://localhost:3001${data.url}`;
            link.setAttribute('download', ''); 
            document.body.appendChild(link);
            link.click();
            link.remove();
          } else {
            toast.success('Export finished: No data found for the selected criteria.');
          }
        } else if (data.status === 'failed') {
          clearInterval(interval);
          toast.error('The export job failed. Please try again.');
        }
       

      } catch (error) {
        clearInterval(interval);
        toast.error('Error checking export status.');
        console.error('Polling error:', error);
      }
    }, 3000); 
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