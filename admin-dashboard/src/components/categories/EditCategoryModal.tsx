import { useEffect, useState } from "react";
import { FormControl, FormLabel, VStack } from "@chakra-ui/react";

import CQModal from "../common/CQModal";
import CQInput from "../common/CQInput";
import CQTextarea from "../common/CQTextarea";

interface EditCategoryModalProps {
  selectedCategory?: Category;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
}

const EditCategoryModal = ({
  selectedCategory,
  isOpen,
  onClose,
  onSubmit,
}: EditCategoryModalProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    setName(selectedCategory?.name || "");
    setDescription(selectedCategory?.description || "");
  }, [selectedCategory, isOpen]);

  return (
    <CQModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => onSubmit(name, description)}
      title={selectedCategory ? "Edit Category" : "Create Category"}
      isSubmitDisabled={!name || !description}
      body={
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel color="gray.600">Category Name</FormLabel>
            <CQInput
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel color="gray.600">Description</FormLabel>
            <CQTextarea
              placeholder="Enter description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
        </VStack>
      }
    />
  );
};

export default EditCategoryModal;
