"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { InvoiceFormValues } from "../invoice-form";
import { LineItemRow } from "../line-item-row";

function makeNewItem(): InvoiceFormValues["lineItems"][number] {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    quantity: 1,
    unit: "hrs",
    rate: 0,
    amount: 0,
  };
}

export function LineItemsSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "lineItems",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = fields.findIndex((f) => f.id === active.id);
        const newIndex = fields.findIndex((f) => f.id === over.id);
        move(oldIndex, newIndex);
      }
    },
    [fields, move],
  );

  const handleDelete = useCallback(
    (index: number) => {
      if (fields.length > 1) remove(index);
    },
    [fields.length, remove],
  );

  const handleAdd = useCallback(() => {
    append(makeNewItem());
  }, [append]);

  const lineItemsError = (errors.lineItems as { message?: string } | undefined)
    ?.message;

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {fields.map((field, index) => (
                <LineItemRow
                  key={field.id}
                  id={field.id}
                  index={index}
                  canDelete={fields.length > 1}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {lineItemsError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg border border-destructive/20 bg-destructive/5 p-3"
        >
          <p className="text-xs font-semibold text-destructive text-center">
            {lineItemsError}
          </p>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.002, translateY: -1 }}
        whileTap={{ scale: 0.998, translateY: 0 }}
        type="button"
        onClick={handleAdd}
        className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-muted/30 bg-muted/5 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:border-primary/20 hover:bg-primary/5 hover:text-primary active:bg-primary/10"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background ring-1 ring-border group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
          <Plus className="h-4 w-4" />
        </div>
        Add New Line Item
      </motion.button>
    </div>
  );
}
