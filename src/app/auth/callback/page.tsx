import CallbackClient from "@/components/Auth/CallbackClient";
import styles from './styles.module.scss';

export default function CallbackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return(
    <div className={styles.container}>
      <CallbackClient error={searchParams.error} />
    </div>
  )
}