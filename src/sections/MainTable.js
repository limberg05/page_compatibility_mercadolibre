import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/table';

function MainTable() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableColumn>Modelo</TableColumn>
          <TableColumn>caracteristica1</TableColumn>
          <TableColumn>caracteristica2</TableColumn>
          <TableColumn>caracteristica3</TableColumn>
          <TableColumn>caracteristica4</TableColumn>
          <TableColumn>alta o baja</TableColumn>
          <TableColumn>Precio</TableColumn>
          <TableColumn>estrellas</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key={1}>
            <TableCell>hola</TableCell>
            <TableCell>2</TableCell>
            <TableCell>3</TableCell>
            <TableCell>4</TableCell>
            <TableCell>5</TableCell>
            <TableCell>6</TableCell>
            <TableCell>7</TableCell>
            <TableCell>8</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
export default MainTable;
