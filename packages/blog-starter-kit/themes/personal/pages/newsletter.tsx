import request from 'graphql-request';
import { GetStaticProps } from 'next';
import { Container } from '../components/container';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/layout';
import { PersonalHeader } from '../components/personal-theme-header';
import { SubscribeForm } from '../components/subscribe-form';
import {
	PostsByPublicationDocument,
	PostsByPublicationQuery,
	PostsByPublicationQueryVariables,
	PublicationFragment,
} from '../generated/graphql';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

type Props = {
	publication: PublicationFragment;
	// initialPosts: PostFragment[];
	// initialPageInfo: PageInfoFragment;
};

const Newsletter = ({ publication }: Props) => {
	console.log(publication);
	return (
		<AppProvider publication={publication}>
			<Layout>
				<Container className="mx-auto flex max-w-3xl flex-col items-stretch gap-10 px-5 py-10">
					<PersonalHeader />
					<SubscribeForm title={publication.title} />
				</Container>
			</Layout>
		</AppProvider>
	);
};

export default Newsletter;

export const getStaticProps: GetStaticProps<Props> = async () => {
	const data = await request<PostsByPublicationQuery, PostsByPublicationQueryVariables>(
		GQL_ENDPOINT,
		PostsByPublicationDocument,
		{
			first: 20,
			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
		},
	);

	const publication = data.publication;
	if (!publication) {
		return {
			notFound: true,
		};
	}
	const initialPosts = (publication.posts.edges ?? []).map((edge) => edge.node);

	return {
		props: {
			publication,
			initialPosts,
			initialPageInfo: publication.posts.pageInfo,
		},
		revalidate: 1,
	};
};
