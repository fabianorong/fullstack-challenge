import TableSearch from "@/src/components/TableSearch";
import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ButtonStack from "@/src/components/ButtonStack";
import PaginationButton from "@/src/components/Pagination";
import Table from "@/src/components/Table";
import { Stack, TableCell, TableRow } from "@mui/material";
import FormModal from "@/src/components/FormModal";
import { Machine, MonitoringPoint, Sensor } from "@prisma/client";
import prisma from "@/src/lib/prisma";
import { ITEMS_PER_PAGE } from "@/src/constants";

type MachineList = Machine & { monitoringPoints: MonitoringPoint[] } & {
  sensors: Sensor[];
};

const MachineListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "ID", accessor: "id" },
    { header: "Type", accessor: "type" },
    { header: "Monitoring Points", accessor: "monitoringpoints" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: MachineList) => {
    return (
      <TableRow key={item.id}>
        <TableCell>
          <h3 className="font-semibold">{item.name}</h3>
        </TableCell>
        <TableCell>{item.id}</TableCell>
        <TableCell>{item.type}</TableCell>
        <TableCell>
          <ul>
            {item.monitoringPoints.map((point) => (
              <li key={point.id}>{point.name}</li>
            ))}
          </ul>
        </TableCell>

        <TableCell sx={{ width: "100px" }}>
          <Stack direction="row" spacing={1}>
            <FormModal table="machine" type="update" data={item} id={item.id} />
            <FormModal table="machine" type="delete" data={item} id={item.id} />
          </Stack>
        </TableCell>
      </TableRow>
    );
  };

  const page = searchParams?.page;

  const p = page ? parseInt(page) : 1;

  const [data, count] = await prisma.$transaction([
    prisma.machine.findMany({
      include: { monitoringPoints: true },
      take: ITEMS_PER_PAGE,
      skip: (p - 1) * ITEMS_PER_PAGE,
    }),
    prisma.machine.count(),
  ]);

  return (
    <Paper
      square={false}
      elevation={1}
      sx={{
        p: 4,
        flex: 1,
        m: 4,
        mt: 0,
      }}
    >
      {/* TOP */}
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Grid
              size="auto"
              sx={{
                display: { xs: "none", md: "block" },
              }}
            >
              <h1 className="text-lg font-semibold">All Machines</h1>
            </Grid>

            <Grid
              size="auto"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 2,
                width: { xs: "100%", md: "auto" },
              }}
            >
              <TableSearch />
              <ButtonStack />
            </Grid>
          </Grid>
        </Box>
        <div className="mt-10">
          <Table columns={columns} renderRow={renderRow} data={data} />
        </div>
        <div className="mt-5">
          <PaginationButton count={count} />
        </div>
      </div>
    </Paper>
  );
};

export default MachineListPage;
