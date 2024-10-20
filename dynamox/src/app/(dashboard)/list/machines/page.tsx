import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import PaginationButton from "@/src/components/Pagination";
import Table from "@/src/components/Table";
import { Stack, TableCell, TableRow } from "@mui/material";
import { Machine, MonitoringPoint, Sensor } from "@prisma/client";
import prisma from "@/src/lib/prisma";
import { ITEMS_PER_PAGE } from "@/src/constants";
import FormContainer from "@/src/components/FormContainer";

type MachineList = Machine & {
  monitoringPoints: MonitoringPoint[];
  sensors: Sensor[];
};

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Type", accessor: "type" },
  { header: "Actions", accessor: "action" },
];

const renderRow = (item: MachineList) => (
  <TableRow key={item.id}>
    <TableCell>
      <h3 className="font-semibold">{item.name}</h3>
    </TableCell>
    <TableCell>{item.type}</TableCell>
    <TableCell sx={{ width: "100px" }}>
      <Stack direction="row" spacing={1}>
        <FormContainer table="machine" type="update" data={item} id={item.id} />
        <FormContainer table="machine" type="delete" data={item} id={item.id} />
      </Stack>
    </TableCell>
  </TableRow>
);

const MachineListPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) => {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  const [data, count] = await prisma.$transaction([
    prisma.machine.findMany({
      include: { monitoringPoints: true },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    }),
    prisma.machine.count(),
  ]);

  return (
    <Paper className="machine-list-paper" square={false} elevation={1}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} className="grid-outer">
          <Grid size="auto" className="grid-title">
            <h1 className="text-lg font-semibold">All Machines</h1>
          </Grid>
          <Grid size="auto" className="grid-controls">
            <FormContainer table="machine" type="create" />
          </Grid>
        </Grid>
      </Box>
      <Grid className="table-container">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </Grid>
      <div className="mt-5">
        <PaginationButton count={count} />
      </div>
    </Paper>
  );
};

export default MachineListPage;
