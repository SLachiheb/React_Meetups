// our-domain.com/
import { MongoClient } from 'mongodb';
import React, { Fragment } from 'react';
import Head from 'next/head';
import MeetupList from './../components/meetups/MeetupList';

const HomePage = props => {
  return (
    <Fragment>
      <Head>
        <meta
          name='description'
          content='Browse a huge list of highly active React meetups'
        />
        <title>React Meetups</title>
      </Head>
      <MeetupList meetups={props.meetups}></MeetupList>
    </Fragment>
  );
};

// export const getServerSideProps = async context => {
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };

export const getStaticProps = async () => {
  //fetch data from an API
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.USERNAME}:${process.env.API_KEY}@cluster0.vmnfv.mongodb.net/meetups?retryWrites=true&w=majority`
  );

  const db = client.db();
  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
        description: meetup.description,
      })),
      revalidate: 1,
    },
  };
};

export default HomePage;
