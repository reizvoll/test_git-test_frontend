import CallbackClient from "@/components/Auth/CallbackClient";
import styles from './styles.module.scss';

export default function CallbackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return(
    <div className={styles.container}>
      <CallbackClient token={searchParams.token} error={searchParams.error} />
    </div>
  )
}