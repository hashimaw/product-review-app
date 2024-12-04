import { SimpleGrid, Skeleton, Pagination, Center, Group } from '@mantine/core';
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductAdd } from './productAdd';
import { FilterProducts } from './filter';

interface Product {id: string; name: string; description: string; price: number; category: string; tags: string[]; use: string; minimumQuantity: number; sellingPrice: number; addedBy: string; expiresAt: string; quantityOnHand: number; reservedQuantity: number; discount: number; imageUrls: string[]; createdAt: string; updatedAt: string}

export function Home () {

  const [page, setPage] = useState(1);

  useEffect(() => { 
    window.scrollTo(0, 0);
  },[page]);

  const { isPending, error, data } = useQuery({
    queryKey: ['products', page],
    queryFn: () =>
      fetch(`https://test-api.nova-techs.com/products?page=${page}`).then((res) =>
        res.json(),
      ),
      enabled: true,
  })

  if (isPending) {
  const skeletons = Array.from({ length: 6 }, (_, index) => ( 
    <Skeleton visible={!isPending} key={index}> 
      <Skeleton height={230} width={340} mt={20} radius="xl"/> 
      <Skeleton height={25} width={150} mt={15} ml={5} radius="xl"/> 
      <Skeleton height={15} width={100} mt={10} ml={5} radius="xl"/> 
      <Skeleton height={20} width={120} mt={10} ml={5} radius="xl"/>
    </Skeleton> ));
    return (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
        {skeletons}
        </SimpleGrid>
      )}

  console.log(data)

  if (error) return 'An error has occurred: ' + error.message
 
    return (
      <>
        <Group mt={40} justify='center'>
          <ProductAdd/> <FilterProducts/>
        </Group>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {data.data.map((product: Product) => (
            <Link className='no-underline' to={`/details/${product.id}` } >
            
            <div id={product.id} className='hover:cursor-pointer hover:bg-slate-200 w-fit p-4 rounded-2xl mt-4'>
               <img className='w-80 h-52 object-cover rounded-xl transition-all duration-700 ease-in-out hover:scale-105' src={product.imageUrls[0]} alt="" />
               <h2 className='m-0 text-gray-800'>{product.name}</h2>
               <p className='m-0 text-gray-800'>{product.category}</p>
               <div className='m-0 flex gap-3'><h4 className='line-through text-red-500 m-0 '>{product.price}</h4><h4 className='m-0 text-green-500'>{product.sellingPrice}</h4></div>
            </div>
            </Link>
          ))}
        </SimpleGrid>

        <Center my={50}>
          <Pagination total={data.totalPages} value={data.page} onChange={setPage} />
        </Center>
        
      </>
    )
}