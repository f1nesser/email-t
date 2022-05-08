import Image from 'next/image'
import Router, { useRouter } from 'next/router'
export default function Images() {
	const router = useRouter()
	const { image } = router.query
	const path = `/${image}`
	return <Image src={path} alt='' layout='fill' />
}
