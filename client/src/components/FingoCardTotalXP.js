import { useCallback, useMemo } from 'react'
import { useApp, useAuth } from 'src/hooks'
import 'src/styles/FingoCardTotalXP.styles.css'
import { ReactComponent as InfoIcon } from 'src/assets/svg/info.svg'
import { useDispatch } from 'react-redux'
import Assets from 'src/assets'
import { ReactComponent as BananaIcon } from 'src/assets/svg/banana-icon.svg'

const FingoCardTotalXP = () => {
    const { totalXP } = useApp()
    const { newUser, user } = useAuth()
    const dispatch = useDispatch()

    const { openModalLevelUp, app_setModalLevelUp } = useApp()

    const getTotalXP = useMemo(() => {
        return newUser
            ? parseInt(sessionStorage.getItem('xp'), 10) || 0
            : totalXP
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newUser])

    const getLevelImage = level => {
        if (level) {
            switch (level) {
                case 1:
                    return Assets.ImageLevel1
                case 2:
                    return Assets.ImageLevel2
                case 3:
                    return Assets.ImageLevel3
                case 4:
                    return Assets.ImageLevel4
                case 5:
                    return Assets.ImageLevel5
                case 6:
                    return Assets.ImageLevel6
                case 7:
                    return Assets.ImageLevel7
                case 8:
                    return Assets.ImageLevel8
                case 9:
                    return Assets.ImageLevel9
                case 10:
                    return Assets.ImageLevel10
                default:
                    return Assets.ImageLevel1
            }
        }
        return Assets.ImageLevel1
    }

    const onClickLevelInfo = useCallback(() => {
        dispatch(
            app_setModalLevelUp({
                open: true,
                data: { total: user?.xp?.total, level: user?.xp?.level },
            })
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalLevelUp])

    return (
        <div className={`mb-3 FingoCardTotalXP FingoShapeRadius`}>
            <div
                className='FingoCardTotalXPImg'
                style={{
                    backgroundImage: `url('${getLevelImage(
                        user?.xp?.level ? parseInt(user.xp.level) : 0
                    )}')`,
                }}
            />
            {/* <h2 className='title'>Total XP</h2> */}
            {!newUser && Boolean(user) && (
                <div className='FingoCardTotalXPHeaderLevel'>
                    <span>LEVEL {user?.xp?.level ?? 1}</span>
                </div>
            )}
            <div className='FingoCardTotalXPInner'>
                <div className='left'>
                    <BananaIcon />
                </div>
                <div className='right'>
                    <div className='xp-header'>
                        <p>Total XP / Next Target</p>
                    </div>
                    <div className='FingoCardTotalXPContent'>
                        <div class='progress'>
                            <div
                                class='progress-bar bg-success'
                                role='progressbar'
                                aria-valuenow={getTotalXP || 0}
                                aria-valuemin='0'
                                aria-valuemax='1000'
                                style={{ width: '50%' }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <button className='FingoIconButton' onClick={onClickLevelInfo}>
                <InfoIcon />
            </button>
        </div>
    )
}

export default FingoCardTotalXP