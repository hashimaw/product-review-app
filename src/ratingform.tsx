import { Rating, TextInput, Textarea, Center, Button, Modal, LoadingOverlay } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'react-router-dom';
import { useForm } from '@mantine/form';


interface Review {
  productId: string;
  rating: number;
  comment: string;
  reviewerName: string;
}


export function ReviewForm () {
  const { id } = useParams<{ id: string }>();
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const form = useForm<Review>({
    mode: 'uncontrolled',
    initialValues: { reviewerName: '', comment: '', rating: 0, productId: id || 'no', },
    validate: {
      reviewerName: (value) => (value.length ==0 ? 'Please enter your name' : null),
      comment: (value) => (value.length< 2 ? "comment should be more than 2 letters" : null),
    },
  });


  const {mutate, isPending, error } = useMutation({
    mutationFn: (newPost: Review) => 
      fetch("https://test-api.nova-techs.com/reviews", {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      }).then((res) => { if (!res.ok) { return res.json().then((error) => { throw new Error(error.message || "Something went wrong"); }); } return res.json(); }),
      onError:()=>{open()},
      onSuccess:() => {
        queryClient.invalidateQueries({queryKey: ["reviews"]});
        form.reset();
        close();
      }
  })

  const handleSubmit = (values: Review) => { mutate({ ...values }); };

    return (
      <>
      <Button onClick={open} variant="filled">add Reviews</Button>
      <Modal opened={opened} onClose={close} title="Review Form" centered>
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }}>
          </LoadingOverlay>
          {error&&<div className='text-center text-red-400'>{error.message}</div>}
          <TextInput
          label="Full Name"
          placeholder="Full Name"
          key={form.key('reviewerName')}
          {...form.getInputProps('reviewerName')}
          /> 
          <Textarea mb={15}
            label="Comment"
            placeholder="give your comment here.."
            key={form.key('comment')}
          {...form.getInputProps('comment')}
          />
          <div className='flex mb-5 gap-10 items-center'>
            <label className='text-base font-medium' htmlFor="">Give your Rating</label>
            <Rating  
            
            {...form.getInputProps('rating')}
          />
          </div>
          <Center> <Button type='submit' variant="filled">Give Review</Button></Center>
             
        </form>
      </Modal>
   
      </>
    )
}