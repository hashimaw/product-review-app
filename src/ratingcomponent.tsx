import { Skeleton, Avatar, Rating } from '@mantine/core';
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom';
import { Carousel } from '@mantine/carousel';


interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: string;
  updatedAt: string;
}

export function RatingComponent () {
  const { id } = useParams<{ id: string }>();


 const reviewsquery = useQuery({
    queryKey: ['reviews'],
    queryFn:()=>
      fetch(`https://test-api.nova-techs.com/reviews/${id}`).then((res) =>
        res.json(),
      ),
      enabled: true,
  })
 
  if (reviewsquery.isPending) {
    return (
      
      <Skeleton visible={!reviewsquery.isPending}> 
        <div className='flex gap-8 mt-10'>
        <Skeleton height={300} width={300} radius="xl"/> 
        <Skeleton height={300} width={300} radius="xl"/> 
        <Skeleton height={300} width={300} radius="xl"/> 
        </div>
      </Skeleton>
     
      )}

  if (reviewsquery.error) return 'An error has occurred: ' + reviewsquery.error.message
 
 
    return (
      <>
   
        <div className='mb-44'>
          {reviewsquery.data.length == 0 ? 
            <div className='text-slate-700 font-medium ml-3'>No reviews for this product be the first</div>         
              :
            <Carousel   withIndicators
              slideSize="33.333333%"
              slideGap="md"
              loop
              align="start"
              controlSize={50}
              slidesToScroll={1}>
                {reviewsquery.data.map((review:Review)=>(
                  <Carousel.Slide>
                  <div id={review.id} className='w-96 h-64 m-2 rounded-2xl flex flex-col gap-3 items-center border-solid border-2 border-slate-700 shadow-lg p-3'>
                      <Avatar mt={7} radius="xl" />
                      <h3 className='text-lg m-0 text-gray-700'>{review.reviewerName}</h3>
                      <Rating value={review.rating} fractions={2} readOnly />
                      <p className='m-0 text-center line-clamp-3 text-gray-800 my-3'>{review.comment}</p>
                  </div>
                  </Carousel.Slide>
                ))}
            </Carousel>
          }
        </div>
      </>
    )
}