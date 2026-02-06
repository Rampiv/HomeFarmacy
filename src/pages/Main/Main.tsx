import "./Main.scss"
import { DataMedicine, uniqueTags } from "../../data"
import { useCallback, useState } from "react"
import { Button } from "antd"

export const Main = () => {
  const [filtered, setFiltered] = useState("")
  const [collapsed, setCollapsed] = useState(true)
  const [searchValue, setSearchValue] = useState("")
  const [showExpired, setShowExpired] = useState(false)

  const collapse = useCallback(() => {
    setCollapsed(prev => !prev)
  }, [])

  const isExpired = (expiryDate: string) => {
    const parts = expiryDate.split(".")
    if (parts.length !== 3) return false

    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[2], 10)

    const expiry = new Date(year, month, day)

    const today = new Date()
    const todayYear = today.getFullYear()
    const todayMonth = today.getMonth()
    const todayDay = today.getDate()
    const todayDate = new Date(todayYear, todayMonth, todayDay)

    return expiry < todayDate
  }

  const handleExpiredClick = () => {
    setShowExpired(!showExpired)
  }

  const filteredData = DataMedicine.filter(item => {
    if (filtered && !item.tags.includes(filtered)) {
      return false
    }

    if (
      searchValue &&
      !item.name.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      return false
    }

    if (showExpired) {
      return isExpired(item.expiryDate)
    }

    return true
  })

  const hasExpiredOrAboutToExpire = DataMedicine.some(item =>
    isExpired(item.expiryDate),
  )

  return (
    <section className="farmacy-block">
      <div className="search">
        <input
          type="search"
          className="search__input"
          placeholder="Поиск по имени"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
      </div>

      <div className="filter-block">
        <Button type="primary" className="filter-block__btn" onClick={collapse}>
          Фильтр
        </Button>
        {!collapsed && (
          <ul className="filter">
            <li className="filter__item">
              <Button
                className="filter__button"
                danger
                type="primary"
                onClick={() => {
                  setFiltered("")
                  collapse()
                }}
              >
                Сброс
              </Button>
            </li>
            {uniqueTags.map((item, index) => {
              return (
                <li key={`filter ${index}`} className="filter__item">
                  <Button
                    className="filter__button"
                    type="default"
                    onClick={() => {
                      setFiltered(item)
                      collapse()
                    }}
                  >
                    {item}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {hasExpiredOrAboutToExpire && (
        <Button type="primary" danger onClick={handleExpiredClick}>
          {showExpired ? "Назад" : "Заканчивается срок"}
        </Button>
      )}

      <ul className="farmacy">
        {filteredData.map((item, index) => {
          const expired = isExpired(item.expiryDate)

          return (
            <li key={index} className={`farmacy__item               }`}>
              <ul className="farmacy__content medicine-descr">
                <li className="medicine-descr__item medicine-descr__name">
                  {item.name}
                  {expired && <span>🚫</span>}
                </li>
                <li
                  className={`medicine-descr__item ${
                    expired ? "medicine-descr__item--expired" : ""
                  }`}
                >
                  {item.expiryDate}
                </li>
                <li className="medicine-descr__item">{item.quantity}</li>
              </ul>

              <ul className="farmacy__content tags">
                {item.tags.map((tag, index) => (
                  <li key={`tags ${index}`} className="tags__item">
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
        {filteredData.length === 0 && (
          <li className="farmacy__item farmacy__item--empty">
            Ничего не найдено
          </li>
        )}
      </ul>
    </section>
  )
}
