
import { sampleData } from '@/data/sampleData'
import DataTable from '@/components/DataTable'

const columns = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Age',
    accessor: 'age',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
]

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        
        <DataTable data={sampleData} columns={columns}/>
    </main>
  )
}
