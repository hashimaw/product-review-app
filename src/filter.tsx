import { Select, RangeSlider, Center, Button, Modal, LoadingOverlay } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconFilter } from '@tabler/icons-react';



export function FilterProducts () {

  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { deleteItem: ""},
    validate: {
        deleteItem: (value) => (value == 'Delete Product' ? null : 'pleace Write Delete Product to Confirm'),
    },
  });


  const {mutate, isPending, error } = useMutation({
    mutationFn: () => 
      fetch(`https://test-api.nova-techs.com/products/`, {
        method: "GET",
        headers: {"Content-type": "application/json; charset=UTF-8"}
      }).then((res) => { if (!res.ok) { return res.json().then((error) => { throw new Error(error.message || "Something went wrong"); }); } return res.json(); }),
      onError:()=>{open()},
      onSuccess:() => {
        queryClient.invalidateQueries({queryKey: ["products"]});
        form.reset();
        close();
      }
  })

  const handleSubmit = () => { mutate(); };

    return (
      <>
        <Button onClick={open} leftSection={<IconFilter size={18} />} variant="outline">Filter</Button>
      <Modal opened={opened} onClose={close} title="Filtering Products" centered>
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }}>
          </LoadingOverlay>
          {error&&<div className='text-center text-red-400'>{error.message}</div>}
          <Select
                label="Category"
                placeholder='all'
                data={['electronics','ring', 'jewlery', 'books']}
              />
              <div className='flex flex-col gap-2.5 text-sm my-3 font-medium'>
                <label>Price Range</label>
                <RangeSlider minRange={50} min={0} max={300} step={2} defaultValue={[0, 300]} />
              </div>
              <Select
                label="Sort by:"
                placeholder='Price'
                data={['Price','date']}
              />
                 <Select mt={8}
                label="Sort Order:"
                placeholder='ascending'
                data={['ascending','descending']}
              />
          <Center mt={20}> <Button type='submit' variant="filled">Filter Products</Button></Center>
             
        </form>
      </Modal>
   
      </>
    )
}