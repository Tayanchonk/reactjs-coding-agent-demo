import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
type SortableItemProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

const SortableItem = ({ id, children, className }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      className={`${className} p-2 rounded cursor-pointer`}
    >
      {children}
    </div>
  );
};

export default SortableItem;
