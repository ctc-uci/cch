// Will have a vstack. First component will be title (of page)
// Second will be the area that allows for starting a form
// Third will be the forms table itself, which allows you to change the behavior of the forms inside.

import { useEffect, useState } from "react";

import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

