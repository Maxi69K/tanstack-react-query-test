import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function App() {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/posts').then((res) =>
        res.json()
      ),
      // staleTime: 60000, -vreme mirovanja / ako klijent ode na drugi tab pa se vrati ponovo{60 sec}
      // refetchOnWindowFocus: false,
      // retry: 3,
      refetchInterval: 60000, // - vreme ponovog preuzimanja/ osvezavanja podataka
  });

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: (newPost) =>
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }).then((res) => res.json()),
    onSuccess: (newPost) => {
      // queryClient.invalidateQueries({queryKey: ['posts']});
      queryClient.setQueryData(['posts'], (oldPosts) => [...oldPosts, newPost]);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error || isError) return <div>Error: {error.message}</div>;

  const renderTodo = () => {
    return data.map((todo, index) => {
      return (
        <div key={index}>
          <h3>{todo.id}</h3>
          <h4>{todo.title}</h4>
          <p>{todo.body}</p>
        </div>
      );
    });
  };

  return (
    <div className="container">
      {isPending && <p>Data is being added...</p>}
      {isSuccess && <p>Data is success send...</p>}
      <button
        onClick={() => {
          mutate({
            userId: 5000,
            id: 4000,
            title: 'Hello my name is Maxi.',
            body: 'This is the body of this post.',
          });
        }}
        className="btn btn-primary m-3"
      >
        Add Post
      </button>
      {renderTodo()}
    </div>
  );
}

export default App;
