import { Skeleton } from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom';
import { ReviewForm } from './ratingform';
import { RatingComponent } from './ratingcomponent';
import { EditProduct } from './productEdit';
import { useEffect } from 'react';
import { DeleteProduct } from './delete';

export function ProductDetails () {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  const productquery = useQuery({
    queryKey: ['product'],
    queryFn:()=>
      fetch(`https://test-api.nova-techs.com/products/${id}`).then((res) =>
        res.json(),
      ),
      enabled: true,
  })

  useEffect(() => { return () => { queryClient.clear(); }; }, [id, queryClient]);

   if (productquery.isPending) {
    return (
      
      <Skeleton visible={!productquery.isPending}> 
        <div className='flex gap-8 mt-10'>
        <Skeleton height={450} width={620} radius="xl"/> 
        <div className=''>
          <Skeleton height={25} width={150} mt={15} ml={5} radius="xl"/> 
          <Skeleton height={15} width={100} mt={10} ml={5} radius="xl"/> 
          <Skeleton height={20} width={120} mt={10} ml={5} radius="xl"/>
          <Skeleton height={50} width={450} mt={10} ml={5} radius="md"/>
        </div>
        </div>
      </Skeleton>
     
      )}



  if (productquery.error) return 'An error has occurred: ' + productquery.error.message
 
    return (
      <>
      <div id={productquery.data.id} className='flex items-stretch gap-6 w-fit  rounded-2xl my-10'>
          <img className='w-[620px] h-[400px] object-cover rounded-xl transition-all duration-700 ease-in-out hover:scale-105' src={productquery.data.imageUrls[0]} alt="" />
          <div className=' flex flex-col justify-between'>
              <div>
                <h2 className='m-0 text-gray-800'>{productquery.data.name}</h2>
                <p className='m-0 text-gray-800'><span className='font-medium mr-2'>category:</span> {productquery.data.category}</p>
                <p className='m-0 text-gray-800'><span className='font-medium mr-2'>tags:</span> {productquery.data.tags.map((tag: String)=>( <span className='mx-1 font-medium text-xs text-gray-500'>{tag}</span> ))}</p>
                <p className='m-0 text-gray-800 my-3'><span className='font-medium mr-2'>Descriprion:</span> {productquery.data.description}</p>
                <p className='m-0 text-gray-800 my-3'><span className='font-medium mr-2'>Stock:</span> {productquery.data.quantityOnHand}</p>
                <div className='m-0 flex gap-3'><h4 className='line-through text-red-500 m-0 '>{productquery.data.price}</h4><h4 className='m-0 text-green-500'>{productquery.data.sellingPrice}</h4></div>
              </div>
              <div className='flex gap-4'>
              <EditProduct product={productquery.data} />
              <DeleteProduct product={productquery.data}/>
              </div>
          </div> 
      </div>

      <div className='flex justify-between'>
        <h2 className='m-0 text-xl ml-3 mb-3 text-gray-800'>Reviews</h2>
        <ReviewForm></ReviewForm>
      </div>
   
     <RatingComponent/>
      </>
    )
}