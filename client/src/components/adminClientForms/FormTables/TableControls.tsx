import { useRef, useState } from "react";
import {
  Box,
  HStack,
  Icon,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";
import { MdFileUpload, MdOutlineManageSearch, MdDelete } from "react-icons/md";
import { FilterTemplate } from "./FilterTemplate.tsx";

import { Dispatch, SetStateAction } from "react";

interface FormQuestion {
  id: number;
  fieldKey: string;
  questionText: string;
  questionType: string;
  displayOrder: number;
  isVisible: boolean;
}

interface TableControlsProps {
  searchKey: string;
  setSearchKey: (value: string) => void;
  filterQuery: string[];
  setFilterQuery: Dispatch<SetStateAction<string[]>>;
  selectedRowIds: number[];
  onDelete?: () => void;
  onExport?: () => void;
  filterType: string;
  showExportCount?: boolean;
  formQuestions?: FormQuestion[]; // For dynamic forms
}

export const TableControls = ({
  searchKey,
  setSearchKey,
  filterQuery,
  setFilterQuery,
  selectedRowIds,
  onDelete,
  onExport,
  filterType,
  showExportCount = false,
  formQuestions,
}: TableControlsProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <HStack
      width="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      <HStack width="100%">
        <FilterTemplate
          setFilterQuery={(value) => {
            if (typeof value === 'function') {
              // This shouldn't happen, but handle it just in case
              const result = value(filterQuery);
              setFilterQuery(result);
            } else {
              setFilterQuery(value);
            }
          }}
          type={filterType}
          formQuestions={formQuestions}
        />
      </HStack>

      <HStack spacing={2}>
        {onDelete && (
          <IconButton
            aria-label="Delete"
            onClick={onDelete}
            isDisabled={selectedRowIds.length === 0}
            colorScheme="red"
            icon={<Icon as={MdDelete} />}
          />
        )}
        {onExport && (
          <>
            {isSearchOpen && (
              <Box>
                <Input
                  ref={searchInputRef}
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder="Search..."
                  width="260px"
                  size="sm"
                />
              </Box>
            )}
            <Box
              display="flex"
              alignItems="center"
              paddingX="16px"
              paddingY="8px"
            >
              <MdOutlineManageSearch
                size="24px"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                style={{ cursor: "pointer" }}
              />
            </Box>
            {showExportCount ? (
              <Box
                display="flex"
                alignItems="center"
                paddingX="16px"
                paddingY="8px"
                onClick={selectedRowIds.length > 0 ? onExport : undefined}
                cursor={selectedRowIds.length > 0 ? "pointer" : "not-allowed"}
                opacity={selectedRowIds.length > 0 ? 1 : 0.5}
              >
                <MdFileUpload size="16px" />
                <Text ml="8px" whiteSpace="nowrap">{`Export (${selectedRowIds.length})`}</Text>
              </Box>
            ) : (
              <IconButton
                aria-label="Download CSV"
                onClick={onExport}
                isDisabled={selectedRowIds.length === 0}
              >
                <FiUpload />
              </IconButton>
            )}
          </>
        )}
      </HStack>
    </HStack>
  );
};

